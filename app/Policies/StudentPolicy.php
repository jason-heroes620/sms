<?php

namespace App\Policies;

use App\Models\Tenant\Students;
use App\Models\User;

class StudentPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct() {}

    public function view(User $user, Students $student)
    {
        return $user->role === 'admin' ||
            ($user->role === 'teacher' && $user->id === $student->class->teacher_in_charge_id) ||
            ($user->role === 'parent' && $user->parent->id === $student->parent_id);
    }
}
