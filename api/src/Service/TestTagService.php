<?php

namespace App\Service;

use App\Entity\TestTag;
use App\Repository\TestTagRepository;
use App\Repository\TagRepository;
use App\Repository\TestRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class TestTagService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TestTagRepository $testTagRepository,
        private TagRepository $tagRepository,
        private TestRepository $testRepository,
    ) {}
    

    public function addTagToTest(?array $data = null): array
    {
        if (!isset($data['tag_id'])
        || !isset($data['test_id'])
        || empty($data)) {
            return [
                'body' => ['error' => 'Missing required field/s'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $tag = $this->tagRepository->find($data['tag_id']);
        if (!$tag) {
            return [
                'body' => ['error' => 'Tag not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $test = $this->testRepository->find($data['test_id']);
        if (!$test) {
            return [
                'body' => ['error' => 'Test not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        // Check if relationship already exists
        $existingRelation = $this->testTagRepository->findOneBy([
            'tag' => $tag,
            'test' => $test
        ]);

        if ($existingRelation) {
            return [
                'body' => ['error' => 'Tag is already applied to this test'],
                'status' => Response::HTTP_CONFLICT
            ];
        }

        $testTag = new TestTag();
        $testTag->setTag($tag);
        $testTag->setTest($test);
        
        $this->entityManager->persist($testTag);
        $this->entityManager->flush();

        return [
            'body' => [
                'message' => 'Tag added to test successfully',
                'tag_name' => $tag->getName(),
                'test_name' => $test->getName()
            ],
            'status' => Response::HTTP_CREATED
        ];
    }

    public function removeTagFromTest(int $tagId, int $testId): array
    {
        $tag = $this->tagRepository->find($tagId);
        $test = $this->testRepository->find($testId);

        if (!$tag || !$test) {
            return [
                'body' => ['error' => 'Tag or test not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $testTag = $this->testTagRepository->findOneBy([
            'tag' => $tag,
            'test' => $test
        ]);

        if (!$testTag) {
            return [
                'body' => ['error' => 'This tag is not applied to the test'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $this->entityManager->remove($testTag);
        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Tag removed from test successfully'],
            'status' => Response::HTTP_OK
        ];
    }

    public function getTestTags(int $testId): array
    {
        $test = $this->testRepository->find($testId);
        if (!$test) {
            return [
                'body' => ['error' => 'Test not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $testTags = $this->testTagRepository->findBy(['test' => $test]);
        
        $tags = [];
        foreach ($testTags as $testTag) {
            $tag = $testTag->getTag();
            $tags[] = [
                'id' => $tag->getId(),
                'name' => $tag->getName()
            ];
        }

        return [
            'body' => $tags,
            'status' => Response::HTTP_OK
        ];
    }

    public function getTestsByTag(int $tagId): array
    {
        $tag = $this->tagRepository->find($tagId);
        if (!$tag) {
            return [
                'body' => ['error' => 'Tag not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $testTags = $this->testTagRepository->findBy(['tag' => $tag]);
        
        $tests = [];
        foreach ($testTags as $testTag) {
            $test = $testTag->getTest();
            $tests[] = [
                'id' => $test->getId(),
                'name' => $test->getName(),
                'category' => $test->getCategory()->getName(),
                'author' => $test->getAuthor()->getName()
            ];
        }

        return [
            'body' => $tests,
            'status' => Response::HTTP_OK
        ];
    }
}
