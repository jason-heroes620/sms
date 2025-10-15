<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Assessments extends Model
{
    use HasUuids;

    protected $table = 'assessments';
    protected $primaryKey = 'assessment_id';
    protected $fillable = [
        'student_id',
        'assessment_date',
        'comments',
        'assessment_status',
        'created_by'
    ];
}
