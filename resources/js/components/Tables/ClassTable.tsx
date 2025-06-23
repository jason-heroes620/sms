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

type Class = {
    class_id: string;
    class_name: string;
};

type Props = {
    classes: {
        data: Class[];
        current_page: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
};

const ClassTable = ({ classes }: Props) => {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Class Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {classes.data && classes.data.length > 0 ? (
                        classes.data.map((c) => (
                            <TableRow key={c.class_id}>
                                <TableCell>{c.class_name}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                No classes found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex py-4">
                {classes.data && classes.data.length > 0
                    ? classes?.links.map((link, index) =>
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

export default ClassTable;
