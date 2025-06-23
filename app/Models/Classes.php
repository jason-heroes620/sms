<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    use HasUuids;

    protected $table = 'classes';
    protected $primaryKey = 'class_id';
    protected $fillable = [
        'term_id',
        'class_name',
    ];
}
