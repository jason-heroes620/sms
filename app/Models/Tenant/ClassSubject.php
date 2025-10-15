<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ClassSubject extends Model
{
    use HasUuids;

    protected $table = 'class_subject';
    protected $primaryKey = 'class_subject_id';
    protected $fillable = [
        'section_id',
        'subject_id',
        'class_subject_status'
    ];
}
