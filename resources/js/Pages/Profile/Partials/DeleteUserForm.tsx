import { Button, Input, Modal } from '@/Components/ui';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 devotional-glow">
                <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-warning-600 mt-0.5 mr-3" />
                    <div>
                        <h2 className="text-lg font-medium text-semantic-text mb-2">
                            Delete Account
                        </h2>
                        <p className="text-sm text-semantic-textSub">
                            Once your account is deleted, all of its resources and data
                            will be permanently deleted. Before deleting your account,
                            please download any data or information that you wish to
                            retain.
                        </p>
                    </div>
                </div>
            </div>

            <Button variant="destructive" onClick={confirmUserDeletion}>
                Delete Account
            </Button>

            <Modal isOpen={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <div className="flex items-center mb-4">
                        <ExclamationTriangleIcon className="h-6 w-6 text-error-600 mr-3" />
                        <h2 className="text-lg font-medium text-semantic-text">
                            Are you sure you want to delete your account?
                        </h2>
                    </div>

                    <p className="text-sm text-semantic-textSub mb-6">
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </p>

                    <div className="mb-6">
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setData('password', e.target.value)
                            }
                            className="w-3/4"
                            placeholder="Password"
                            error={errors.password}
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>

                        <Button 
                            type="submit" 
                            variant="destructive" 
                            disabled={processing}
                        >
                            {processing ? 'Deleting...' : 'Delete Account'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
