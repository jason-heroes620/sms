<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class GuardianStudent extends Model
{
    use HasUuids;

    protected $table = 'guardian_student';
    protected $primaryKey = 'guardian_student_id';
    protected $fillable = [
        'guardian_id',
        'student_id',
        'relationship'
    ];
    public $timestamps = false;
}
