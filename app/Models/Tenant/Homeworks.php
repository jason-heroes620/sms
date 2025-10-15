<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Homeworks extends Model
{
    use HasUuids;

    protected $table = 'homeworks';
    protected $primaryKey = 'homework_id';
    protected $fillable = [
        'homework_description',
        'homework_date',
        'class_id',
        'subject_id',
        'created_by',
    ];

    public function submissions()
    {
        return $this->hasMany(HomeworkSubmissions::class, 'homework_id', 'homework_id');
    }
}
