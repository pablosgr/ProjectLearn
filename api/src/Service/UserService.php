<?php

namespace App\Service;

use App\Entity\User;
use App\Enum\UserRole;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private ValidatorInterface $validator,
        private UserPasswordHasherInterface $passwordHasher,
    ) {}
    

    public function registerUser(array $data): array
    {
        //Check required fields
        $requiredFields = ['name', 'username', 'email', 'password', 'role'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                return [
                    'body' => ['error' => 'Missing required field/s'],
                    'status' => Response::HTTP_BAD_REQUEST
                ];
            }
        }

        $existingUser = $this->userRepository->findOneByEmailOrUsername(
            $data['email'],
            $data['username']
        );

        if ($existingUser) {
            if ($existingUser->getEmail() === $data['email']) {
                return [
                    'body' => ['error' => 'Email already in use'],
                    'status' => Response::HTTP_CONFLICT
                ];
            }
            if ($existingUser->getUsername() === $data['username']) {
                return [
                    'body' => ['error' => 'Username already in use'],
                    'status' => Response::HTTP_CONFLICT
                ];
            }
        }

        // Convert the role string to the UserRole enum
        try {
            $role = UserRole::from($data['role']);
        } catch (\ValueError $e) {
            return [
                'body' => ['error' => 'Invalid role provided. Allowed values are: student, teacher, admin.'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $user = new User();
        $user->setName($data['name']);
        $user->setUsername($data['username']);
        $user->setEmail($data['email']);
        $user->setPassword(
            $this->passwordHasher->hashPassword($user, $data['password'])
        );
        $user->setRole($role);

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            return [
                'body' => ['error' => (string) $errors],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return [
            'body' => [
                'message' => 'User registered successfully',
                'username' => $user->getUsername()
            ],
            'status' => Response::HTTP_CREATED
        ];
    }


    public function deleteUser(string $id): array
    {
        
        if (empty($id)) {
            return [
                'body' => ['error' => 'Missing required field'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }
        

        $user = $this->userRepository->findOneBy(['id' => $id]);
        if (!$user) {
            return [
                'body' => ['error' => 'User not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return [
            'body' => ['message' => 'User deleted successfully'],
            'status' => Response::HTTP_OK
        ];
    }


    public function updateUser(string $id, ?array $data = null): array
    {
        if (empty($id) || empty($data) || $data === null) {
            return [
                'body' => ['error' => 'Invalid body request'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $user = $this->userRepository->findOneBy(['id' => $id]);
        if (!$user) {
            return [
                'body' => ['error' => 'User not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $requiredFields = ['name', 'username'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                return [
                    'body' => ['error' => 'Missing required field/s in body request'],
                    'status' => Response::HTTP_BAD_REQUEST
                ];
            }
        }

        $user->setName($data['name']);
        $user->setUsername($data['username']);

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            return [
                'body' => ['error' => (string) $errors],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $this->entityManager->flush();

        return [
            'body' => ['message' => 'User updated successfully'],
            'status' => Response::HTTP_OK
        ];
    }


    public function listAllUsers(): array
    {
        $users = $this->userRepository->findAll();
        $userList = [];

        foreach ($users as $user) {
            $userList[] = [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'role' => $user->getRole()->value,
            ];
        }

        return [
            'body' => ['users' => $userList],
            'status' => Response::HTTP_OK
        ];
    }


    public function listUsersByParam(string $param, ?string $query_value = null): array
    {
        $paramOptions = ['id', 'name', 'username', 'email', 'role'];

        if (empty($param) || !in_array($param, $paramOptions)) {
            return [
                'body' => ['error' => 'Parameter not allowed'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }
        
        if ($query_value === null) {
            return [
                'body' => ['error' => 'Missing value parameter in query string'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $users = $this->userRepository->findBy([$param => $query_value]);
        if (empty($users)) {
            return [
                'body' => ['error' => 'No users found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }
        $userList = [];

        foreach ($users as $user) {
            $userList[] = [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'role' => $user->getRole()->value,
            ];
        }

        return [
            'body' => ['users' => $userList],
            'status' => Response::HTTP_OK
        ];
    }
}
