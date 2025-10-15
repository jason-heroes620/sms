<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Guardians extends Model
{
    use HasUuids;

    protected $table = 'guardians';
    protected $primaryKey = 'guardian_id';
    protected $fillable = [
        'guardian_id',
        'designation',
        'first_name',
        'last_name',
        'contact_no',
        'email',
        'occupation',
    ];
}
