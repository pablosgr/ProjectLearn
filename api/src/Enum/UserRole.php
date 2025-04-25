<?php

namespace App\Enum;

enum UserRole: string
{
    case STUDENT = 'student';
    case TEACHER = 'teacher';
    case ADMIN = 'admin';
}
