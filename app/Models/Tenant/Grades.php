<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Grades extends Model
{
    use HasUuids;

    protected $table = 'grades';
    protected $primaryKey = 'grade_id';
    protected $fillable = [
        'grade_name',
        'min_mark',
        'max_mark',
        'grade_remark',
        'grade_order',
    ];

    public function students()
    {
        return $this->hasMany(Students::class, 'grade_id', 'grade_id');
    }

    public function subjects()
    {
        return $this->belongsToMany(Subjects::class, 'grade_subjects', 'grade_id', 'subject_id');
    }
}
