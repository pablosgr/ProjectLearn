<?php

namespace App\Controller;

use App\Service\QuestionService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;

#[Route('/question', name: 'question')]

final class QuestionController extends AbstractController{
    #[Route('', name: 'post_question', methods: ['POST'])]
    public function create_question(
        Request $request,
        QuestionService $questionService
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $questionService -> createQuestion($data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'delete_question', methods: ['DELETE'])]
    public function delete_question(
        int $id,
        QuestionService $questionService,
    ): JsonResponse
    {
        $result  = $questionService -> deleteQuestion($id);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'update_question', methods: ['PUT'])]
    public function update_question(
        int $id,
        Request $request,
        QuestionService $questionService
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $questionService -> updateQuestion($id, $data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('', name: 'list_all_questions', methods: ['GET'])]
    public function get_all_questions(
        QuestionService $questionService
    ): JsonResponse
    {
        $result  = $questionService -> listAllQuestions();

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{param}', name: 'get_question_by_param', methods: ['GET'])]
    public function get_question_by_param(
        string $param,
        QuestionService $questionService,
        Request $request
    ): JsonResponse
    {
        $query_value = $request -> query -> get('value');
        $result  = $questionService -> listQuestionsByParam($param, $query_value);

        return $this -> json($result['body'], $result['status']);
    }
}
