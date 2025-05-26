<?php

namespace App\Service;

use App\Entity\Classroom;
use App\Enum\UserRole;
use App\Repository\ClassroomRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class ClassroomService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private ClassroomRepository $classroomRepository,
    ) {}
    

    public function createClassroom(array $data): array
    {
        //Check required fields
        $requiredFields = ['name', 'teacher'];
        foreach ($requiredFields as $field) {
            if (!$data[$field]) {
                return [
                    'body' => ['error' => "Missing $field field"],
                    'status' => Response::HTTP_BAD_REQUEST
                ];
            }
        }

        $teacher = $this->userRepository->find($data['teacher']);
        if (!$teacher || $teacher->getRole() !== UserRole::TEACHER) {
            return [
                'body' => ['error' => 'Teacher not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }
        
        $classroom = new Classroom();
        $classroom->setName($data['name']);
        $classroom->setTeacher($teacher);
        
        $this->entityManager->persist($classroom);
        $this->entityManager->flush();

        return [
            'body' => [
                'message' => 'Classroom registered successfully',
                'classrom_name' => $classroom->getName()
            ],
            'status' => Response::HTTP_CREATED
        ];
    }


    public function deleteClassroom(int $id): array
    {
        $classroom = $this->classroomRepository->find($id);
        if (!$classroom) {
            return [
                'body' => ['error' => 'Classroom not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $this->entityManager->remove($classroom);
        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Classroom deleted successfully'],
            'status' => Response::HTTP_OK
        ];
    }


    public function updateClassroom(int $id, ?array $data = null): array
    {
        $classroom = $this->classroomRepository->find($id);
        if (!$classroom) {
            return [
                'body' => ['message' => 'Classroom not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        if (empty($data) || !isset($data['name'])) {
            return [
                'body' => ['error' => 'Missing or incorrect field in body request'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $newName = $data['name'];
        $classroom->setName($newName);
        $this->entityManager->flush();

        return [
            'body' => ['message' => "Classroom name successfully updated to $newName"],
            'status' => Response::HTTP_OK
        ];
    }


    public function listAllClassrooms(): array
    {
        $classrooms = $this->classroomRepository->findAll();
        if (empty($classrooms)) {
            return [
                'body' => ['error' => 'No classrooms found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $classroomList = [];

        foreach ($classrooms as $classroom) {
            $classroomList[] = [
                'id' => $classroom->getId(),
                'name' => $classroom->getName(),
                'teacher_id' => $classroom->getTeacher()->getId(),
                'teacher_name' => $classroom->getTeacher()->getName(),
                'teacher_username' => $classroom->getTeacher()->getUsername(),
                'created_at' => $classroom->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return [
            'body' => ['classrooms' => $classroomList],
            'status' => Response::HTTP_OK
        ];
    }


    public function listClassroomsByParam(string $param, ?string $query_value = null): array
    {
        $paramOptions = ['id', 'name', 'teacher_id'];

        if (empty($param) || !in_array($param, $paramOptions)) {
            return [
                'body' => ['error' => 'Parameter missing or not allowed'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }
        
        if ($query_value === null) {
            return [
                'body' => ['error' => 'Missing value parameter in query string'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $classrooms = $this->classroomRepository->findBy([$param => $query_value]);
        if (empty($classrooms)) {
            return [
                'body' => ['error' => 'No classrooms found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }
        $classroomList = [];

        foreach ($classrooms as $classroom) {
            $classroomList[] = [
                'id' => $classroom->getId(),
                'teacher_id' => $classroom->getTeacher()->getId(),
                'teacher_name' => $classroom->getTeacher()->getName(),
                'teacher_username' => $classroom->getTeacher()->getUsername(),
                'name' => $classroom->getName(),
                'created_at' => $classroom->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return [
            'body' => ['users' => $classroomList],
            'status' => Response::HTTP_OK
        ];
    }
}
