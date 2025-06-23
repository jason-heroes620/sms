import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { router } from '@inertiajs/react';

type Subject = {
    subject_id: string;
    subject_name: string;
};

type Props = {
    subjects: {
        data: Subject[];
        current_page: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
};

const SubjectTable = ({ subjects }: Props) => {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Subject Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subjects.data && subjects.data.length > 0 ? (
                        subjects.data.map((subject) => (
                            <TableRow key={subject.subject_id}>
                                <TableCell>{subject.subject_name}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                No subjects found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex py-4">
                {subjects.data && subjects.data.length > 0
                    ? subjects?.links.map((link, index) =>
                          link.url ? (
                              <Button
                                  key={index}
                                  variant={link.active ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => router.visit(link.url || '')}
                                  dangerouslySetInnerHTML={{
                                      __html: link.label,
                                  }}
                              />
                          ) : (
                              <Button
                                  key={index}
                                  variant="ghost"
                                  size="sm"
                                  disabled
                              >
                                  <span
                                      dangerouslySetInnerHTML={{
                                          __html: link.label,
                                      }}
                                  />
                              </Button>
                          ),
                      )
                    : ''}
            </div>
        </div>
    );
};

export default SubjectTable;
