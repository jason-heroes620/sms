<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ClassStudent extends Model
{
    use HasUuids;

    protected $table = 'class_student';
    protected $primaryKey = 'class_student_id';
    protected $fillable = [
        'class_id',
        'student_id',
        'section_id',
        'class_student_status',
    ];

    public $timestamps = false;
}
