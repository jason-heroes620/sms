import SearchSelect from '@/components/SearchSelect';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Classes } from '@/types';
import { toCamelCase } from '@/utils/toCamelCase';
import { Head, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { CircleChevronLeft, Loader2Icon } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { TagCheckbox } from './TagCheckbox';

type TagGroup = {
    tag_group_id: string;
    tag_group: string;
    tag_color: string;
};

type TagParent = {
    tag_id: string;
    parent: string;
    tags: Tag[];
};
type Tag = {
    tag_id: string;
    tag: string;
    tag_group_id: string;
};

const AddAssessment = ({
    classes,
    tag_groups,
    tags,
}: {
    classes: Classes[];
    tag_groups: TagGroup[];
    tags: Tag[];
}) => {
    const { data, setData, processing, post, errors } = useForm<{
        class_id: string;
        student_id: string;
        comments: string;
        tag_group_id: string;
        tags: string[];
    }>({
        class_id: '',
        student_id: '',
        comments: '',
        tag_group_id: '',
        tags: [],
    });
    const [loading, setLoading] = useState(false);
    const handleStudentSelect = (studentId: string) => {
        setData('student_id', studentId);
    };

    const handleTagGroupChange = (value: string) => {
        setData('tag_group_id', value);
        setData('tags', []);
    };
    const handleSubmit = (e: FormEvent) => {
        post(route('assessment.store'), {
            onSuccess: () => {
                toast.success('Assessment Added.');
                router.visit(route('assessments.index'));
            },
            onError: () => {
                toast.error('There was an error adding assessment.');
            },
        });
    };

    const handleGenerateSentence = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await axios.post(route('assessment.generate'), data).then((resp) => {
            if (resp.status === 200) {
                console.log(resp.data.comment);
                setData('comments', resp.data.comment);
                setLoading(false);
            }
        });
    };
    return (
        <AuthenticatedLayout>
            <Head title="Add Assessment" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() =>
                                router.visit(route('assessments.index'))
                            }
                        />
                        <div>
                            <span className="font-bold">Assessment</span>
                            <span> | Add Assessment</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="class_name"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Class
                                            <span className="text-red-800">
                                                {' '}
                                                *
                                            </span>
                                        </label>
                                        <div className="">
                                            <Select
                                                onValueChange={(value) =>
                                                    setData('class_id', value)
                                                }
                                                required
                                            >
                                                <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                                    <SelectValue placeholder="Select Class" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {classes?.map(
                                                            (c: Classes) => {
                                                                return (
                                                                    <SelectItem
                                                                        key={
                                                                            c.class_id
                                                                        }
                                                                        value={
                                                                            c.class_id
                                                                        }
                                                                    >
                                                                        {`(${c.branch_name}) - ${c.class_name}`}
                                                                    </SelectItem>
                                                                );
                                                            },
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="student_name"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Student Name
                                            <span className="text-red-800">
                                                {' '}
                                                *
                                            </span>
                                        </label>
                                        <div className="mt-1">
                                            <SearchSelect
                                                endpoint={
                                                    data.class_id
                                                        ? `/getStudentByClass/${data.class_id}`
                                                        : ''
                                                }
                                                placeholder="Search Student"
                                                onSelect={handleStudentSelect}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col py-4">
                                    <Label>Assessment Type</Label>
                                    <div className="mt-2 flex flex-row gap-4 py-2">
                                        {tag_groups?.map((t: TagGroup) => (
                                            <div key={t.tag_group_id}>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleTagGroupChange(
                                                            t.tag_group_id,
                                                        )
                                                    }
                                                    className={`cursor-pointer rounded-xl border px-4 py-2 font-extrabold shadow-md`}
                                                    style={{
                                                        backgroundColor:
                                                            data.tag_group_id ===
                                                            t.tag_group_id
                                                                ? t.tag_color
                                                                : 'white',
                                                        color:
                                                            data.tag_group_id ===
                                                            t.tag_group_id
                                                                ? 'white'
                                                                : t.tag_color,
                                                    }}
                                                >
                                                    {toCamelCase(t.tag_group)}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        {data.tag_group_id && (
                                            <div className="px-4">
                                                <div>
                                                    {tags
                                                        .filter(
                                                            (tag) =>
                                                                tag.tag_group_id ===
                                                                data.tag_group_id,
                                                        )
                                                        .map((t: any) => (
                                                            <div
                                                                className="flex flex-col py-2"
                                                                key={t.tag_id}
                                                            >
                                                                <span className="font-bold italic">
                                                                    {t.parent}
                                                                </span>
                                                                <div className="flex flex-row gap-4 py-2">
                                                                    {t.tags.map(
                                                                        (
                                                                            tag: Tag,
                                                                        ) => (
                                                                            <TagCheckbox
                                                                                key={
                                                                                    tag.tag_id
                                                                                }
                                                                                label={
                                                                                    tag.tag
                                                                                }
                                                                                value={
                                                                                    tag.tag
                                                                                }
                                                                                checked={data.tags.some(
                                                                                    (
                                                                                        s,
                                                                                    ) =>
                                                                                        s ===
                                                                                        tag.tag,
                                                                                )}
                                                                                onCheckedChange={(
                                                                                    checked,
                                                                                ) =>
                                                                                    checked
                                                                                        ? setData(
                                                                                              'tags',
                                                                                              [
                                                                                                  ...data.tags,
                                                                                                  tag.tag,
                                                                                              ],
                                                                                          )
                                                                                        : setData(
                                                                                              'tags',
                                                                                              data.tags?.filter(
                                                                                                  (
                                                                                                      value,
                                                                                                  ) =>
                                                                                                      value !=
                                                                                                      tag.tag,
                                                                                              ),
                                                                                          )
                                                                                }
                                                                            />
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Button
                                        type={'button'}
                                        variant={'primary'}
                                        onClick={(e) =>
                                            handleGenerateSentence(e)
                                        }
                                        disabled={
                                            loading ||
                                            data.class_id == '' ||
                                            data.student_id == '' ||
                                            data.tags.length == 0
                                                ? true
                                                : false
                                        }
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2Icon className="animate-spin" />
                                                Generating ...
                                            </>
                                        ) : (
                                            'Generate'
                                        )}
                                    </Button>
                                </div>
                                <div className="py-4">
                                    <hr />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="col-span-2 md:col-span-2">
                                        <label
                                            htmlFor=""
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Comments
                                        </label>
                                        <Textarea
                                            className="mt-1"
                                            rows={10}
                                            value={data.comments}
                                            onChange={(e) =>
                                                setData(
                                                    'comments',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end py-4">
                                    <Button
                                        type="submit"
                                        variant={'primary'}
                                        size={'sm'}
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving ...' : 'Add'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AddAssessment;
