import Button from "./Button";

const ConfirmationModal = ({
  btnContent1 = "Cancel",
  btnContent2 = "Confirm",
  onCancel,
  onConfirm,
  title = "Are you sure?",
  subtitle = "This action cannot be undone.",
}) => {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-xl p-6 space-y-6 shadow-2xl border border-white/20 ring-1 ring-gray-900/5">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-600 text-sm leading-6">{subtitle}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          content={btnContent1}
          click={onCancel}
          variant="outline"
          size="md"
        />
        <Button
          content={btnContent2}
          click={onConfirm}
          variant="danger"
          size="md"
        />
      </div>
    </div>
  );
};

export default ConfirmationModal;
