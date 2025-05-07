<?php

namespace App\Service;

use App\Entity\TestAssignment;
use App\Repository\TestAssignmentRepository;
use App\Repository\ClassroomRepository;
use App\Repository\TestRepository;
use App\Repository\UnitRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class TestAssignmentService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TestAssignmentRepository $testAssignmentRepository,
        private ClassroomRepository $classroomRepository,
        private TestRepository $testRepository,
        private UnitRepository $unitRepository,
    ) {}
    

    public function assignTest(?array $data = null): array
    {
        if (!isset($data['classroom_id'])
        || !isset($data['test_id'])
        || empty($data)) {
            return [
                'body' => ['error' => 'Missing required field/s'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $classroom = $this->classroomRepository->find($data['classroom_id']);
        if (!$classroom) {
            return [
                'body' => ['error' => 'Classroom not found'],
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

        // Check if assignment already exists
        $existingAssignment = $this->testAssignmentRepository->findOneBy([
            'classroom' => $classroom,
            'test' => $test
        ]);

        if ($existingAssignment) {
            return [
                'body' => ['error' => 'Test is already assigned to this classroom'],
                'status' => Response::HTTP_CONFLICT
            ];
        }

        $assignment = new TestAssignment();
        $assignment->setClassroom($classroom);
        $assignment->setTest($test);
        
        // Optional fields
        if (isset($data['unit_id'])) {
            $unit = $this->unitRepository->find($data['unit_id']);
            if (!$unit) {
                return [
                    'body' => ['error' => 'Unit not found'],
                    'status' => Response::HTTP_NOT_FOUND
                ];
            }
            $assignment->setUnit($unit);
        }
        
        if (isset($data['due_date'])) {
            $dueDate = new \DateTimeImmutable($data['due_date']);
            $assignment->setDueDate($dueDate);
        }
        
        if (isset($data['time_limit'])) {
            $assignment->setTimeLimit($data['time_limit']);
        }
        
        if (isset($data['visibility'])) {
            $assignment->setVisibility($data['visibility']);
        }
        
        if (isset($data['is_mandatory'])) {
            $assignment->setIsMandatory($data['is_mandatory']);
        }
        
        $this->entityManager->persist($assignment);
        $this->entityManager->flush();

        return [
            'body' => [
                'message' => 'Test assigned successfully',
                'classroom_name' => $classroom->getName(),
                'test_name' => $test->getName()
            ],
            'status' => Response::HTTP_CREATED
        ];
    }

    public function removeAssignment(int $classroomId, int $testId): array
    {
        $classroom = $this->classroomRepository->find($classroomId);
        $test = $this->testRepository->find($testId);

        if (!$classroom || !$test) {
            return [
                'body' => ['error' => 'Classroom or test not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $assignment = $this->testAssignmentRepository->findOneBy([
            'classroom' => $classroom,
            'test' => $test
        ]);

        if (!$assignment) {
            return [
                'body' => ['error' => 'Assignment not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $this->entityManager->remove($assignment);
        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Test assignment removed successfully'],
            'status' => Response::HTTP_OK
        ];
    }

    public function listClassroomAssignments(int $classroomId): array
    {
        $classroom = $this->classroomRepository->find($classroomId);
        if (!$classroom) {
            return [
                'body' => ['error' => 'Classroom not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $assignments = $this->testAssignmentRepository->findBy(['classroom' => $classroom]);
        
        $result = [];
        foreach ($assignments as $assignment) {
            $test = $assignment->getTest();
            $unit = $assignment->getUnit();
            
            $result[] = [
                'test_id' => $test->getId(),
                'test_name' => $test->getName(),
                'unit_id' => $unit ? $unit->getId() : null,
                'unit_name' => $unit ? $unit->getName() : null,
                'assigned_at' => $assignment->getAssignedAt()->format('Y-m-d H:i:s'),
                'due_date' => $assignment->getDueDate() ? $assignment->getDueDate()->format('Y-m-d H:i:s') : null,
                'time_limit' => $assignment->getTimeLimit(),
                'visibility' => $assignment->isVisible(),
                'is_mandatory' => $assignment->isMandatory()
            ];
        }

        return [
            'body' => $result,
            'status' => Response::HTTP_OK
        ];
    }
}
