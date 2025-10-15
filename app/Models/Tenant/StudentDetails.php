<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class StudentDetails extends Model
{
    use HasUuids;

    protected $table = 'student_details';
    protected $primaryKey = 'student_detail_id';
    protected $fillable = [
        'student_id',
        'allergy',
        'disease',
        'additional_notes'
    ];
    public $timestamps = false;
}
