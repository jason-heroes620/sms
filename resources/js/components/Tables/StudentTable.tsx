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

type Student = {
    first_name: string;
    last_name: string;
    registration_no: string;
};

type Props = {
    students: {
        data: Student[];
        current_page: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
};

const StudentTable = ({ students }: Props) => {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.data && students.data.length > 0 ? (
                        students.data.map((student) => (
                            <TableRow key={student.registration_no}>
                                <TableCell>
                                    {student.first_name}, {student.last_name}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                No students found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex py-4">
                {students.data && students.data.length > 0
                    ? students?.links.map((link, index) =>
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

export default StudentTable;
