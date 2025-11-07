<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Exams extends Model
{
    use HasUuids;

    protected $table = 'exams';
    protected $primaryKey = 'exam_id';
    protected $fillable = [
        'exam_name',
        'exam_description',
        'start_date',
        'end_date',
        'created_by',
        'class_id',
        'subject_id'
    ];

    public $timestamps = true;

    public function subject()
    {
        return $this->belongsTo(Subjects::class, 'subject_id', 'subject_id');
    }

    public function class()
    {
        return $this->belongsTo(Classes::class, 'class_id', 'class_id');
    }
}
