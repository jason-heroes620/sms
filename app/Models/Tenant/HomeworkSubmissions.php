<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class HomeworkSubmissions extends Model
{
    use HasUuids;

    protected $table = 'homework_submissions';
    protected $primaryKey = 'homework_submission_id';
    protected $fillable = [
        'homework_id',
        'student_id',
        'submission_date',
        'homework_path',
        'comments',
        'marks',
        'commented_by',
    ];
}
