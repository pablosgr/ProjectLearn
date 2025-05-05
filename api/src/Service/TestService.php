<?php

namespace App\Service;

use App\Entity\Test;
use App\Repository\TestRepository;
use App\Repository\UserRepository;
use App\Repository\CategoryRepository;
use App\Enum\UserRole;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class TestService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TestRepository $testRepository,
        private UserRepository $userRepository,
        private CategoryRepository $categoryRepository,
    ) {}
    

    public function createTest(?array $data = null): array
    {
        if (!isset($data['name'])
        || !isset($data['category'])
        || !isset($data['author'])
        || empty($data)) {
            return [
                'body' => ['error' => 'Missing required field/s'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        
        $user = $this->userRepository->find($data['author']);
        if (!$user || $user->getRole() !== UserRole::TEACHER) {
            return [
                'body' => ['error' => 'Teacher user not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }
        
        $category = $this->categoryRepository->find($data['category']);
        if (!$category) {
            return [
                'body' => ['error' => 'Category not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $test = new Test();
        $test->setName($data['name']);
        $test->setCategory($category);
        $test->setAuthor($user);
        
        $this->entityManager->persist($test);
        $this->entityManager->flush();

        return [
            'body' => [
                'message' => 'Test registered successfully',
                'test_name' => $test->getName()
            ],
            'status' => Response::HTTP_CREATED
        ];
    }


    public function deleteTest(int $id): array
    {
        $test = $this->testRepository->find($id);
        if (!$test) {
            return [
                'body' => ['error' => 'Test not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $this->entityManager->remove($test);
        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Test deleted successfully'],
            'status' => Response::HTTP_OK
        ];
    }


    public function updateTest(int $id, array $data): array
    {
        $test = $this->testRepository->find($id);
        if (!$test) {
            return [
                'body' => ['error' => 'Test not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        if (empty($data)) {
            return [
                'body' => ['error' => 'No data provided for update'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        if (isset($data['name'])) {
            $test->setName($data['name']);
        }
        if (isset($data['category'])) {
            $category = $this->categoryRepository->find($data['category']);
            if (!$category) {
                return [
                    'body' => ['error' => 'Category not found'],
                    'status' => Response::HTTP_NOT_FOUND
                ];
            }
            $test->setCategory($category);
        }

        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Test updated successfully'],
            'status' => Response::HTTP_OK
        ];
    }


    public function listAllTests(): array
    {
        $tests = $this->testRepository->findAll();
        if (!$tests) {
            return [
                'body' => ['error' => 'No tests found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $testsList = [];
        foreach ($tests as $test) {
            $testsList[] = [
                'id' => $test->getId(),
                'name' => $test->getName(),
                'category' => $test->getCategory()->getName(),
                'author' => $test->getAuthor()->getUsername(),
                'created_at' => $test->getCreatedAt()->format('Y-m-d H:i:s')
            ];
        }

        return [
            'body' => $testsList,
            'status' => Response::HTTP_OK
        ];
    }


    public function listTestsByParam(string $parameter, string $query_value): array
    {
        $allowedParams = ['id', 'name', 'category', 'author'];
        if (!in_array($parameter, $allowedParams)) {
            return [
                'body' => ['error' => 'Invalid parameter'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        if (empty($query_value)) {
            return [
                'body' => ['error' => 'Query value cannot be empty'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $test = $this->testRepository->findOneBy([$parameter => $query_value]);
        if (!$test) {
            return [
                'body' => ['error' => 'Test not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        return [
            'body' => [
                'id' => $test->getId(),
                'name' => $test->getName(),
                'category' => $test->getCategory()->getName(),
                'author' => $test->getAuthor()->getUsername(),
                'created_at' => $test->getCreatedAt()->format('Y-m-d H:i:s')
            ],
            'status' => Response::HTTP_OK
        ];
    }
}
