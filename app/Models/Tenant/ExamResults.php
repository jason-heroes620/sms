<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ExamResults extends Model
{
    use HasUuids;
    protected $table = 'exam_results';
    protected $primaryKey = 'exam_result_id';
    protected $fillable = [
        'exam_id',
        'student_id',
        'marks',
        'grade',
        'comments',
    ];
}
