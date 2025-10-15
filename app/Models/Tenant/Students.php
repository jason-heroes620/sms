<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Students extends Model
{
    use HasUuids;

    protected $table = 'students';
    protected $primaryKey = 'student_id';
    protected $fillable = [
        'last_name',
        'first_name',
        'gender',
        'dob',
        'registration_no',
        'admission_date',
        'nic',
        'profile_picture',
        'religion',
        'race',
        'student_status',
    ];
}
