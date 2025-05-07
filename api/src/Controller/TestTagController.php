<?php

namespace App\Controller;

use App\Service\TestTagService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/testtags', name: 'test_tags')]

class TestTagController extends AbstractController
{
    public function __construct(
        private TestTagService $testTagService
    ) {}

    #[Route('', name: 'add_test_tag', methods: ['POST'])]
    public function addTagToTest(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $result = $this->testTagService->addTagToTest($data);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }

    #[Route('/tag/{tagId}/test/{testId}', name: 'remove_test_tag', methods: ['DELETE'])]
    public function removeTagFromTest(int $tagId, int $testId): JsonResponse
    {
        $result = $this->testTagService->removeTagFromTest($tagId, $testId);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }

    #[Route('/test/{id}', name: 'get_test_tags', methods: ['GET'])]
    public function getTestTags(int $id): JsonResponse
    {
        $result = $this->testTagService->getTestTags($id);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }

    #[Route('/tag/{id}', name: 'get_tests_by_tag', methods: ['GET'])]
    public function getTestsByTag(int $id): JsonResponse
    {
        $result = $this->testTagService->getTestsByTag($id);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }
}
