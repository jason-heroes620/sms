<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class HomeworkSubmissionList extends Model
{
    protected $table = 'homework_submission_lists';
    protected $primaryKey = 'homework_submission_list_id';
    protected $fillable = [
        'homework_submission_list_id',
        'homework_submission_id',
        'submission_date',
        'file_path',
        'submission_status'
    ];
}
