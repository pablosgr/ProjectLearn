<?php

namespace App\Service;

use App\Entity\Unit;
use App\Entity\Classroom;
use App\Repository\UnitRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class UnitService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UnitRepository $unitRepository,
    ) {}
    

    public function createUnit(?array $data = null): array
    {
        if (!isset($data['name']) 
        || !isset($data['index_order']) 
        || !isset($data['classroom_id'])
        || empty($data)) {
            return [
                'body' => ['error' => 'Missing required field/s'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $unit = new Unit();
        $unit->setName($data['name']);
        $unit->setIndexOrder($data['index_order']);
        
        $classroom = $this->entityManager->getRepository(Classroom::class)->find($data['classroom_id']);
        if (!$classroom) {
            return [
                'body' => ['error' => 'Classroom not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }
        $unit->setClassroom($classroom);

        if (isset($data['description'])) {
            $unit->setDescription($data['description']);
        }
        
        $this->entityManager->persist($unit);
        $this->entityManager->flush();

        return [
            'body' => [
                'message' => 'Unit registered successfully',
                'unit_name' => $unit->getName()
            ],
            'status' => Response::HTTP_CREATED
        ];
    }


    public function deleteUnit(int $id): array
    {
        $unit = $this->unitRepository->find($id);
        if (!$unit) {
            return [
                'body' => ['error' => 'Unit not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $this->entityManager->remove($unit);
        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Unit successfully deleted'],
            'status' => Response::HTTP_OK
        ];
    }


    public function updateUnit(int $id, ?array $data = null): array
    {
        $unit = $this->unitRepository->find($id);
        if (!$unit) {
            return [
                'body' => ['message' => 'Unit not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        if (isset($data['name'])) {
            $unit->setName($data['name']);
        }
        if (isset($data['description'])) {
            $unit->setDescription($data['description']);
        }
        if (isset($data['index_order'])) {
            $unit->setIndexOrder($data['index_order']);
        }

        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Unit updated successfully'],
            'status' => Response::HTTP_OK
        ];
    }


    public function listAllUnits(): array
    {
        $units = $this->unitRepository->findAll();
        if (empty($units)) {
            return [
                'body' => ['error' => 'No units found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $unitList = [];

        foreach ($units as $unit) {
            $unitList[] = [
                'id' => $unit->getId(),
                'name' => $unit->getName(),
                'description' => $unit->getDescription(),
                'classroom_id' => $unit->getClassroom()->getId(),
            ];
        }

        return [
            'body' => ['units' => $unitList],
            'status' => Response::HTTP_OK
        ];
    }


    public function listUnitByParam(?string $param, ?string $query_value): array
    {
        $admittedParams = ['id', 'name', 'description', 'classroom_id'];
        if (!in_array($param, $admittedParams)) {
            return [
                'body' => ['error' => 'Invalid parameter'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        if ($query_value === null) {
            return [
                'body' => ['error' => 'Missing value parameter in query string'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        if ($param === 'classroom_id') {
            $unit = $this->unitRepository->findBy(['classroom' => $query_value]);
        } else {
            $unit = $this->unitRepository->findBy([$param => $query_value]);
        }

        if (empty($unit)) {
            return [
                'body' => ['error' => 'No units found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $unitList = [];
        foreach ($unit as $u) {
            $unitList[] = [
                'id' => $u->getId(),
                'name' => $u->getName(),
                'description' => $u->getDescription(),
                'classroom_id' => $u->getClassroom()->getId(),
            ];
        }

        return [
            'body' => ['units' => $unitList],
            'status' => Response::HTTP_OK
        ];
    }
}
