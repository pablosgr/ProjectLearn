<?php

namespace App\Service;

use App\Entity\Option;
use App\Repository\OptionRepository;
use App\Repository\QuestionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class OptionService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private OptionRepository $optionRepository,
        private QuestionRepository $questionRepository,
    ) {}

    
    public function createOption(?array $data = null): array
    {
        if (!isset($data['question'])
        || !isset($data['option_text'])
        || !isset($data['is_correct'])
        || !isset($data['index_order'])
        || empty($data)) {
            return [
                'body' => ['error' => 'Missing required field/s'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $question = $this->questionRepository->find($data['question']);
        if (!$question) {
            return [
                'body' => ['error' => 'Question not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $option = new Option();
        $option->setQuestion($question);
        $option->setOptionText($data['option_text']);
        $option->setIsCorrect($data['is_correct']);
        $option->setIndexOrder($data['index_order']);

        $this->entityManager->persist($option);
        $this->entityManager->flush();

        return [
            'body' => [
                'message' => 'Option created successfully',
                'id' => $option->getId()
            ],
            'status' => Response::HTTP_CREATED
        ];
    }


    public function deleteOption(int $id): array
    {
        $option = $this->optionRepository->find($id);
        if (!$option) {
            return [
                'body' => ['error' => 'Option not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $this->entityManager->remove($option);
        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Option deleted successfully'],
            'status' => Response::HTTP_OK
        ];
    }


    public function updateOption(int $id, ?array $data = null): array
    {
        $option = $this->optionRepository->find($id);
        if (!$option) {
            return [
                'body' => ['error' => 'Option not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        if (!isset($data)) {
            return [
                'body' => ['error' => 'Missing required field/s'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        if (isset($data['option_text'])) {
            $option->setOptionText($data['option_text']);
        }
        if (isset($data['is_correct'])) {
            $option->setIsCorrect($data['is_correct']);
        }
        if (isset($data['index_order'])) {
            $option->setIndexOrder($data['index_order']);
        }

        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Option updated successfully'],
            'status' => Response::HTTP_OK
        ];
    }


    public function listAllOptions(): array
    {
        $options = $this->optionRepository->findAll();
        if (!$options) {
            return [
                'body' => ['error' => 'No options found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $optionsList = [];
        foreach ($options as $option) {
            $optionsList[] = [
                'id' => $option->getId(),
                'question' => $option->getQuestion()->getId(),
                'option_text' => $option->getOptionText(),
                'is_correct' => $option->isCorrect(),
                'index_order' => $option->getIndexOrder()
            ];
        }

        return [
            'body' => $optionsList,
            'status' => Response::HTTP_OK
        ];
    }


    public function listOptionsByParam(string $param, string $query_value): array
    {
        $options = $this->optionRepository->findBy([$param => $query_value]);
        if (!$options) {
            return [
                'body' => ['error' => 'No options found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $optionsList = [];
        foreach ($options as $option) {
            $optionsList[] = [
                'id' => $option->getId(),
                'question' => $option->getQuestion()->getId(),
                'option_text' => $option->getOptionText(),
                'is_correct' => $option->isCorrect(),
                'index_order' => $option->getIndexOrder()
            ];
        }

        return [
            'body' => $optionsList,
            'status' => Response::HTTP_OK
        ];
    }
}