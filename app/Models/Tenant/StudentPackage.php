<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class StudentPackage extends Model
{
    use HasUuids;

    protected $table = 'student_packages';
    protected $primaryKey = 'student_package_id';
    protected $fillable = [
        'student_id',
        'package_id',
        'start_date',
        'end_date',
        'status',
        'created_by',
        'updated_by'
    ];
}
