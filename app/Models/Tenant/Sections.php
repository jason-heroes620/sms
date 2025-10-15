<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Sections extends Model
{
    use HasUuids;

    protected $table = 'sections';
    protected $primaryKey = 'section_id';
    protected $fillable = [
        'section_name',
        'class_id',
        'capacity',
        'teacher_in_charge',
        'section_status'
    ];
}
