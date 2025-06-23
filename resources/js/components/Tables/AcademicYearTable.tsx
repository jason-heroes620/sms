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
import moment from 'moment';

type Class = {
    academic_year_id: string;
    academic_year: string;
    start_date: Date;
    end_date: Date;
    is_current: string;
};

type Props = {
    academicYears: {
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

const AcademicYearTable = ({ academicYears }: Props) => {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Academic Years</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Current</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {academicYears.data && academicYears.data.length > 0 ? (
                        academicYears.data.map((a, index) => (
                            <TableRow
                                key={index}
                                className={
                                    a.is_current === 'true'
                                        ? 'bg-green-100'
                                        : ''
                                }
                            >
                                <TableCell>{a.academic_year}</TableCell>
                                <TableCell>
                                    {moment(a.start_date).format('DD MMM YYYY')}
                                </TableCell>
                                <TableCell>
                                    {moment(a.end_date).format('DD MMM YYYY')}
                                </TableCell>
                                <TableCell>
                                    {a.is_current === 'true' ? 'Current' : ''}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                No academic years found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div>
                <span></span>
            </div>

            {/* Pagination */}
            <div className="flex gap-1 py-4">
                {academicYears.data && academicYears.data.length > 0
                    ? academicYears?.links.map((link, index) =>
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

export default AcademicYearTable;
