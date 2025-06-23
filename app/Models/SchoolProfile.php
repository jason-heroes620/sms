<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SchoolProfile extends Model
{
    use HasUuids;

    protected $table = 'school_profile';
    protected $primaryKey = 'school_profile_id';
    public $timestamps = false;

    protected $casts = [
        'school_address' => 'array',
    ];

    protected $fillable = [
        'school_name',
        'school_address',
        'school_contact_no',
        'school_email',
        'school_logo',
    ];
}
