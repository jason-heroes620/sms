<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Subjects extends Model
{
    use HasUuids;

    protected $table = 'subjects';
    protected $primaryKey = 'subject_id';
    protected $fillable = [
        'term_id',
        'subject_name',
    ];
}
