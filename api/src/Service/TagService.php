<?php

namespace App\Service;

use App\Entity\Tag;
use App\Repository\TagRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class TagService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TagRepository $tagRepository,
    ) {}
    

    public function createTag(?array $data = null): array
    {
        if (!isset($data['name']) || empty($data)) {
            return [
                'body' => ['error' => 'Missing name field'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        if ($this->tagRepository->findOneBy(['name' => $data['name']])) {
            return [
                'body' => ['error' => 'Tag already exists'],
                'status' => Response::HTTP_CONFLICT
            ];
        }

        $tag = new Tag();
        $tag->setName($data['name']);
        
        $this->entityManager->persist($tag);
        $this->entityManager->flush();

        return [
            'body' => [
                'message' => 'Tag registered successfully',
                'tag_name' => $tag->getName()
            ],
            'status' => Response::HTTP_CREATED
        ];
    }


    public function deleteTag(int $id): array
    {
        $tag = $this->tagRepository->find($id);
        if (!$tag) {
            return [
                'body' => ['error' => 'Tag not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $this->entityManager->remove($tag);
        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Tag deleted successfully'],
            'status' => Response::HTTP_OK
        ];
    }


    public function listAllTags(): array
    {
        $tags = $this->tagRepository->findAll();
        if (!$tags) {
            return [
                'body' => ['error' => 'No tags found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $tagsList = [];
        foreach ($tags as $tag) {
            $tagsList[] = [
                'id' => $tag->getId(),
                'name' => $tag->getName()
            ];
        }

        return [
            'body' => $tagsList,
            'status' => Response::HTTP_OK
        ];
    }


    public function listTagByParam(string $param, ?string $query_value = null): array
    {
        $allowedParams = ['id', 'name'];
        if (!in_array($param, $allowedParams)) {
            return [
                'body' => ['error' => 'Invalid parameter'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        if ($query_value === null) {
            return [
                'body' => ['error' => 'Missing query value'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $tag = $this->tagRepository->findOneBy([$param => $query_value]);
            if (!$tag) {
                return [
                    'body' => ['error' => 'Tag not found'],
                    'status' => Response::HTTP_NOT_FOUND
                ];
            }
        
        $tagData = [
            'id' => $tag->getId(),
            'name' => $tag->getName()
        ];

        return [
            'body' => $tagData,
            'status' => Response::HTTP_OK
        ];
    }
}
