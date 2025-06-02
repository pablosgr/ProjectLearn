<?php

namespace App\Service;

use App\Entity\Question;
use App\Repository\TestRepository;
use App\Repository\QuestionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class QuestionService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TestRepository $testRepository,
        private QuestionRepository $questionRepository,
    ) {}
    

    public function createQuestion(?array $data = null): array
    {
        if (!isset($data['test'])
        || !isset($data['question_text'])
        || empty($data)) {
            return [
                'body' => ['error' => 'Missing required field/s'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $test = $this->testRepository->find($data['test']);
        if (!$test) {
            return [
                'body' => ['error' => 'Test not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $question = new Question();
        $question->setTest($test);
        $question->setQuestionText($data['question_text']);
        
        if (isset($data['type'])) {
            $question->setType($data['type']);
        }

        $this->entityManager->persist($question);
        $this->entityManager->flush();

        return [
            'body' => [
                'message' => 'Question created successfully',
                'id' => $question->getId()
            ],
            'status' => Response::HTTP_CREATED
        ];
    }


    public function deleteQuestion(int $id): array
    {
        $question = $this->questionRepository->find($id);
        if (!$question) {
            return [
                'body' => ['error' => 'Question not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $this->entityManager->remove($question);
        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Question deleted successfully'],
            'status' => Response::HTTP_OK
        ];
    }


    public function updateQuestion(int $id, ?array $data = null): array
    {
        $question = $this->questionRepository->find($id);
        if (!$question) {
            return [
                'body' => ['error' => 'Question not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        if (empty($data)) {
            return [
                'body' => ['error' => 'No data provided'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        if (isset($data['question_text'])) {
            $question->setQuestionText($data['question_text']);
        }

        if (isset($data['type'])) {
            $question->setType($data['type']);
        }

        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Question updated successfully'],
            'status' => Response::HTTP_OK
        ];
    }


    public function listAllQuestions(): array
    {
        $questions = $this->questionRepository->findAll();
        if (!$questions) {
            return [
                'body' => ['error' => 'No questions found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $questionsList = [];
        foreach ($questions as $question) {
            $questionsList[] = [
                'id' => $question->getId(),
                'test' => $question->getTest()->getName(),
                'question_text' => $question->getQuestionText(),
                'type' => $question->getType()
            ];
        }

        return [
            'body' => $questionsList,
            'status' => Response::HTTP_OK
        ];
    }


    public function listQuestionsByParam(string $param, ?string $query_value = null): array
    {
        $accepted_params = ['id', 'test', 'question_text', 'type'];
        if (!in_array($param, $accepted_params)) {
            return [
                'body' => ['error' => 'Invalid parameter'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        if ($param === 'test') {
            $test = $this->testRepository->find($query_value);
            if (!$test) {
                return [
                    'body' => ['error' => 'Test not found'],
                    'status' => Response::HTTP_NOT_FOUND
                ];
            }
            $questions = $this->questionRepository->findBy(['test' => $test]);
        } else {
            $questions = $this->questionRepository->findBy([$param => $query_value]);
        }

        if (!$questions) {
            return [
                'body' => ['error' => 'No questions found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $questionsList = [];
        foreach ($questions as $question) {
            $questionsList[] = [
                'id' => $question->getId(),
                'test' => $question->getTest()->getName(),
                'question_text' => $question->getQuestionText(),
                'type' => $question->getType()
            ];
        }

        return [
            'body' => $questionsList,
            'status' => Response::HTTP_OK
        ];
    }
}
