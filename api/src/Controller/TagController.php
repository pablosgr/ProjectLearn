<?php

namespace App\Controller;

use App\Service\TagService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/tag', name: 'tag')]

final class TagController extends AbstractController{
    #[Route('', name: 'post_tag', methods: ['POST'])]
    public function create_tag(
        Request $request,
        TagService $tagService
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $tagService -> createTag($data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'delete_tag', methods: ['DELETE'])]
    public function delete_tag(
        int $id,
        TagService $tagService,
    ): JsonResponse
    {
        $result  = $tagService -> deleteTag($id);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('', name: 'list_all_tags', methods: ['GET'])]
    public function get_all_tags(
        TagService $tagService
    ): JsonResponse
    {
        $result  = $tagService -> listAllTags();

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{param}', name: 'get_tag_by_param', methods: ['GET'])]
    public function get_tag_by_param(
        string $param,
        TagService $tagService,
        Request $request
    ): JsonResponse
    {
        $query_value = $request -> query -> get('value');
        $result  = $tagService -> listTagByParam($param, $query_value);

        return $this -> json($result['body'], $result['status']);
    }
}
    