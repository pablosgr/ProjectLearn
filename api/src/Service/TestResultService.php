<?php

namespace App\Service;

use App\Entity\TestResult;
use App\Repository\UserRepository;
use App\Repository\ClassroomRepository;
use App\Repository\TestResultRepository;
use App\Repository\TestRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class TestResultService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TestResultRepository $testResultRepository,
        private TestRepository $testRepository,
        private UserRepository $userRepository,
        private ClassroomRepository $classroomRepository
    ) {}

    public function createTestResult(?array $data = null): array
    {
        if (!isset($data['user'])
        || !isset($data['class'])
        || !isset($data['test'])
        || !isset($data['score'])
        || !isset($data['total_questions'])
        || !isset($data['correct_answers'])
        || !isset($data['status'])
        || !isset($data['started_at'])
        || !isset($data['ended_at'])
        || empty($data)) {
            return [
                'body' => ['error' => 'Missing required field/s'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $user = $this->userRepository->find($data['user']);
        if (!$user) {
            return [
                'body' => ['error' => 'User not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $class = $this->classroomRepository->find($data['class']);
        if (!$class) {
            return [
                'body' => ['error' => 'Class not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $test = $this->testRepository->find($data['test']);
        if (!$test) {
            return [
                'body' => ['error' => 'Test not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $testResult = new TestResult();
        $testResult->setStudent($user);
        $testResult->setClassroom($class);
        $testResult->setTest($test);
        $testResult->setScore($data['score']);
        $testResult->setTotalQuestions($data['total_questions']);
        $testResult->setCorrectAnswers($data['correct_answers']);
        $testResult->setStatus($data['status']);
        $testResult->setStartedAt(new \DateTimeImmutable($data['started_at']));
        $testResult->setEndedAt(new \DateTimeImmutable($data['ended_at']));

        $this->entityManager->persist($testResult);
        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Test result created successfully'],
            'status' => Response::HTTP_CREATED
        ];
    }


    public function listAllTestResults(): array
    {
        $testResults = $this->testResultRepository->findAll();
        if (!$testResults) {
            return [
                'body' => ['error' => 'No test results found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $testResultsList = [];
        foreach ($testResults as $testResult) {
            $testResultsList[] = [
                'id' => $testResult->getId(),
                'student' => $testResult->getStudent()->getName(),
                'classroom' => $testResult->getClassroom()->getName(),
                'test' => $testResult->getTest()->getName(),
                'score' => $testResult->getScore(),
                'total_questions' => $testResult->getTotalQuestions(),
                'correct_answers' => $testResult->getCorrectAnswers(),
                'status' => $testResult->getStatus(),
                'started_at' => $testResult->getStartedAt()->format('Y-m-d H:i:s'),
                'ended_at' => $testResult->getEndedAt()->format('Y-m-d H:i:s')
            ];
        }

        return [
            'body' => $testResultsList,
            'status' => Response::HTTP_OK
        ];
    }

    public function listTestResultsByParam(string $param, string $query_value): array
    {
        if (!in_array($param, ['student', 'classroom', 'test'])) {
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

        $testResults = $this->testResultRepository->findBy([$param => $query_value]);
        if (!$testResults) {
            return [
                'body' => ['error' => 'No test results found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $testResultsList = [];
        foreach ($testResults as $testResult) {
            $testResultsList[] = [
                'id' => $testResult->getId(),
                'student' => $testResult->getStudent()->getName(),
                'classroom' => $testResult->getClassroom()->getName(),
                'test' => $testResult->getTest()->getName(),
                'score' => $testResult->getScore(),
                'total_questions' => $testResult->getTotalQuestions(),
                'correct_answers' => $testResult->getCorrectAnswers(),
                'status' => $testResult->getStatus(),
                'started_at' => $testResult->getStartedAt()->format('Y-m-d H:i:s'),
                'ended_at' => $testResult->getEndedAt()->format('Y-m-d H:i:s')
            ];
        }

        return [
            'body' => $testResultsList,
            'status' => Response::HTTP_OK
        ];
    }
}
