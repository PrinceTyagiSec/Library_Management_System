import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Loader, UserCog, UserPlus } from "lucide-react";

interface UserFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (user: { name: string; email: string; password?: string; is_admin: boolean }) => void;
    initialData?: { name: string; email: string; is_admin: boolean };
    isEdit?: boolean;
    isSubmitting: boolean;
}

export default function UserFormModal({
    open,
    onClose,
    onSubmit,
    initialData = { name: "", email: "", is_admin: false },
    isEdit = false,
    isSubmitting = false,
}: UserFormModalProps) {
    const [name, setName] = useState(initialData.name);
    const [email, setEmail] = useState(initialData.email);
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(initialData.is_admin);
    useEffect(() => {
        if (open && !isEdit) {

            setName("");
            setEmail("");
            setIsAdmin(false);
            setPassword("");
        } else if (open && isEdit && initialData) {

            setName(initialData.name);
            setEmail(initialData.email);
            setIsAdmin(initialData.is_admin);
            setPassword("");
        }
    }, [open]);
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = () => {
        if (!name.trim() || !email.trim() || (!isEdit && !password.trim())) {
            toast.error("Name, Email, and Password are required.");
            return;
        }
        if (!isValidEmail(email.trim())) {
            toast.error("Please enter a valid email address.");
            return;
        }

        const userPayload = {
            name: name.trim(),
            email: email.trim(),
            is_admin: isAdmin,
            ...(isEdit ? {} : { password: password.trim() }),
        };

        onSubmit(userPayload);
        onClose();
    };

    return (
        <>
            {isSubmitting && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
                    <Loader className="h-10 w-10 animate-spin text-white" />
                </div>
            )}
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="bg-gradient-to-br from-gray-800 to-blue-900 text-white border border-gray-700 shadow-2xl">

                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-white text-xl font-semibold">
                            {isEdit ? <UserCog size={20} /> : <UserPlus size={20} />}
                            {isEdit ? "Edit User" : "Add User"}
                        </DialogTitle>

                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {!isEdit && (
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        )}
                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                                className="mr-2 accent-blue-600"
                            />
                            <label className="text-sm text-gray-300">Make Admin</label>

                        </div>
                        <Button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white"
                            disabled={isSubmitting}
                        >

                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader className="w-4 h-4 animate-spin" />
                                    <span>{isEdit ? "Updating" : "Adding"}...</span>
                                </div>
                            ) : (
                                <span>{isEdit ? "Update" : "Add"} User</span>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
