import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from './ui/button';

const EditSheet = ({
    isSheetOpen,
    setIsSheetOpen,
    children,
}: {
    isSheetOpen: boolean;
    setIsSheetOpen: any;
    children: any;
}) => {
    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className="w-full px-4 md:max-w-2xl">
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                {children}
                <SheetFooter className="flex md:grid md:grid-cols-3">
                    <div></div>
                    <SheetClose asChild>
                        <Button variant="default">Close</Button>
                    </SheetClose>
                    <div></div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default EditSheet;
