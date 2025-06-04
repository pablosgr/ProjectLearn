<?php

namespace App\Service;

use App\Entity\Test;
use App\Entity\Question;
use App\Entity\Option;
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
                'test_name' => $test->getName(),
                'test_id' => $test->getId()
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

        // Delete all options and questions first
        foreach ($test->getQuestions() as $question) {
            foreach ($question->getOptions() as $option) {
                $this->entityManager->remove($option);
            }
            $this->entityManager->remove($question);
        }

        // Then delete the test
        $this->entityManager->remove($test);
        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Test and all related content deleted successfully'],
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

        // Update basic test info
        if (isset($data['name'])) {
            $test->setName($data['name']);
        }
        if (isset($data['category_id'])) {
            $category = $this->categoryRepository->find($data['category_id']);
            if (!$category) {
                return [
                    'body' => ['error' => 'Category not found'],
                    'status' => Response::HTTP_NOT_FOUND
                ];
            }
            $test->setCategory($category);
        }

        // Handle questions update
        if (isset($data['questions'])) {
            // Remove all existing questions and their options
            foreach ($test->getQuestions() as $question) {
                foreach ($question->getOptions() as $option) {
                    $this->entityManager->remove($option);
                }
                $this->entityManager->remove($question);
            }
            
            // Create new questions and options
            foreach ($data['questions'] as $questionData) {
                $question = new Question();
                $question->setTest($test);
                $question->setQuestionText($questionData['question_text']);
                $question->setType($questionData['type'] ?? null);
                $this->entityManager->persist($question);
                
                // Create options for this question
                if (isset($questionData['options']) && is_array($questionData['options'])) {
                    foreach ($questionData['options'] as $optionData) {
                        $option = new Option();
                        $option->setQuestion($question);
                        $option->setOptionText($optionData['option_text']);
                        $option->setIsCorrect($optionData['is_correct']);
                        $option->setIndexOrder($optionData['index_order']);
                        $this->entityManager->persist($option);
                        $question->addOption($option);
                    }
                }
            }
        }

        $this->entityManager->flush();
        
        // Fetch fresh data
        $this->entityManager->refresh($test);

        // Format response
        $questions = [];
        foreach ($test->getQuestions() as $question) {
            $options = [];
            foreach ($question->getOptions() as $option) {
                $options[] = [
                    'id' => $option->getId(),
                    'option_text' => $option->getOptionText(),
                    'is_correct' => $option->isCorrect(),
                    'index_order' => $option->getIndexOrder()
                ];
            }

            $questions[] = [
                'id' => $question->getId(),
                'question_text' => $question->getQuestionText(),
                'type' => $question->getType(),
                'options' => $options
            ];
        }

        $updatedTest = [
            'id' => $test->getId(),
            'name' => $test->getName(),
            'category' => $test->getCategory()->getName(),
            'author_name' => $test->getAuthor()->getName(),
            'author_username' => $test->getAuthor()->getUsername(),
            'created_at' => $test->getCreatedAt()->format('Y-m-d H:i:s'),
            'questions' => $questions
        ];

        return [
            'body' => $updatedTest,
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
            $questions = [];
            foreach ($test->getQuestions() as $question) {
                $options = [];
                foreach ($question->getOptions() as $option) {
                    $options[] = [
                        'id' => $option->getId(),
                        'option_text' => $option->getOptionText(),
                        'is_correct' => $option->isCorrect(),
                        'index_order' => $option->getIndexOrder()
                    ];
                }

                $questions[] = [
                    'id' => $question->getId(),
                    'question_text' => $question->getQuestionText(),
                    'type' => $question->getType(),
                    'options' => $options
                ];
            }

            $testsList[] = [
                'id' => $test->getId(),
                'name' => $test->getName(),
                'category_id' => $test->getCategory()->getId(),
                'category' => $test->getCategory()->getName(),
                'author_name' => $test->getAuthor()->getName(),
                'author_username' => $test->getAuthor()->getUsername(),
                'created_at' => $test->getCreatedAt()->format('Y-m-d H:i:s'),
                'questions' => $questions
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

        $tests = $this->testRepository->findBy([$parameter => $query_value]);
        if (!$tests) {
            return [
                'body' => ['error' => 'Test not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $testsList = [];
        foreach ($tests as $test) {
            $questions = [];
            foreach ($test->getQuestions() as $question) {
                $options = [];
                foreach ($question->getOptions() as $option) {
                    $options[] = [
                        'id' => $option->getId(),
                        'option_text' => $option->getOptionText(),
                        'is_correct' => $option->isCorrect(),
                        'index_order' => $option->getIndexOrder()
                    ];
                }

                $questions[] = [
                    'id' => $question->getId(),
                    'question_text' => $question->getQuestionText(),
                    'type' => $question->getType(),
                    'options' => $options
                ];
            }

            $testsList[] = [
                'id' => $test->getId(),
                'name' => $test->getName(),
                'category_id' => $test->getCategory()->getId(),
                'category' => $test->getCategory()->getName(),
                'author_name' => $test->getAuthor()->getName(),
                'author_username' => $test->getAuthor()->getUsername(),
                'created_at' => $test->getCreatedAt()->format('Y-m-d H:i:s'),
                'questions' => $questions
            ];
        }
        
        return [
            'body' => $testsList,
            'status' => Response::HTTP_OK
        ];
    }
}
