<?php

namespace App\Service;

use App\Entity\StudentClass;
use App\Repository\StudentClassRepository;
use App\Repository\ClassroomRepository;
use App\Repository\UserRepository;
use App\Enum\UserRole;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class StudentClassService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private StudentClassRepository $studentClassRepository,
        private ClassroomRepository $classroomRepository,
        private UserRepository $userRepository,
    ) {}
    

    public function enrollStudent(?array $data = null): array
    {
        if (!isset($data['classroom_id'])
        || !isset($data['student_id'])
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

        $student = $this->userRepository->find($data['student_id']);
        if (!$student || $student->getRole() !== UserRole::STUDENT) {
            return [
                'body' => ['error' => 'Student not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }
        
        $existingEnrollment = $this->studentClassRepository->findOneBy([
            'classroom' => $classroom,
            'student' => $student
        ]);

        if ($existingEnrollment) {
            return [
                'body' => ['error' => 'Student already enrolled in this classroom'],
                'status' => Response::HTTP_CONFLICT
            ];
        }

        $studentClass = new StudentClass();
        $studentClass->setClassroom($classroom);
        $studentClass->setStudent($student);
        
        $this->entityManager->persist($studentClass);
        $this->entityManager->flush();

        return [
            'body' => [
                'message' => 'Student enrolled successfully',
                'classroom_name' => $classroom->getName(),
                'student_name' => $student->getName()
            ],
            'status' => Response::HTTP_CREATED
        ];
    }

    public function removeEnrollment(?array $data = null): array
    {
        if (!isset($data['classroom_id'])
        || !isset($data['student_id'])
        || empty($data)) {
            return [
                'body' => ['error' => 'Missing required field/s'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $classroom = $this->classroomRepository->find($data['classroom_id']);
        $student = $this->userRepository->find($data['student_id']);

        if (!$classroom || !$student) {
            return [
                'body' => ['error' => 'Classroom or student not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $enrollment = $this->studentClassRepository->findOneBy([
            'classroom' => $classroom,
            'student' => $student
        ]);

        if (!$enrollment) {
            return [
                'body' => ['error' => 'Enrollment not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $this->entityManager->remove($enrollment);
        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Student enrollment removed successfully'],
            'status' => Response::HTTP_OK
        ];
    }

    public function listClassStudents(int $classroomId): array
    {
        $classroom = $this->classroomRepository->find($classroomId);
        if (!$classroom) {
            return [
                'body' => ['error' => 'Classroom not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $enrollments = $this->studentClassRepository->findBy(['classroom' => $classroom]);
        
        $students = [];
        foreach ($enrollments as $enrollment) {
            $student = $enrollment->getStudent();
            $students[] = [
                'id' => $student->getId(),
                'name' => $student->getName(),
                'username' => $student->getUsername(),
                'email' => $student->getEmail()
            ];
        }

        return [
            'body' => $students,
            'status' => Response::HTTP_OK
        ];
    }

    public function getStudentEnrollments(string $studentId): array
    {
        $student = $this->userRepository->find($studentId);
        if (!$student || $student->getRole() !== UserRole::STUDENT) {
            return [
                'body' => ['error' => 'Student not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $enrollments = $this->studentClassRepository->findBy(['student' => $student]);
        
        $classrooms = [];
        foreach ($enrollments as $enrollment) {
            $classroom = $enrollment->getClassroom();
            $teacher = $classroom->getTeacher();
            
            $classrooms[] = [
                'id' => $classroom->getId(),
                'name' => $classroom->getName(),
                'description' => $classroom->getDescription(),
                'teacher' => [
                    'id' => $teacher->getId(),
                    'name' => $teacher->getName()
                ],
                'created_at' => $classroom->getCreatedAt()->format('Y-m-d H:i:s'),
                'enrollment_id' => $enrollment->getId()
            ];
        }

        return [
            'body' => $classrooms,
            'status' => Response::HTTP_OK
        ];
    }
}
