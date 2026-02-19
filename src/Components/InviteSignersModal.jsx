import { useState } from "react";
import { inviteSigner } from "../api/signature";

export default function InviteSignersModal({ onClose, fileId }) {
  const [receivers, setReceivers] = useState([
    { name: "", email: "", role: "Signer" },
  ]);

  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...receivers];
    updated[index][field] = value;
    setReceivers(updated);
  };

  const addReceiver = () => {
    setReceivers([
      ...receivers,
      { name: "", email: "", role: "Signer" },
    ]);
  };

  const removeReceiver = (index) => {
    const updated = receivers.filter((_, i) => i !== index);
    setReceivers(updated);
  };

  // ✅ SEND INVITES
  const handleApply = async () => {
    try {
      setLoading(true);

      for (const receiver of receivers) {
        if (!receiver.email) continue;

        await inviteSigner({
          fileId,
          email: receiver.email,
          name: receiver.name,
          role: receiver.role,
        });
      }

      alert("Invites sent successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to send invites");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[700px] rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">
          Create your signature request
        </h2>

        <p className="mb-4 text-gray-600">
          Who will receive your document?
        </p>

        {/* Receivers List */}
        <div className="space-y-3">
          {receivers.map((receiver, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border p-3 rounded"
            >
              <input
                type="text"
                placeholder="Name"
                value={receiver.name}
                onChange={(e) =>
                  handleChange(index, "name", e.target.value)
                }
                className="border p-2 rounded w-1/3"
              />

              <input
                type="email"
                placeholder="Email"
                value={receiver.email}
                onChange={(e) =>
                  handleChange(index, "email", e.target.value)
                }
                className="border p-2 rounded w-1/3"
              />

              <select
                value={receiver.role}
                onChange={(e) =>
                  handleChange(index, "role", e.target.value)
                }
                className="border p-2 rounded"
              >
                <option>Signer</option>
                <option>Validator</option>
                <option>Witness</option>
              </select>

              <button
                onClick={() => removeReceiver(index)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add Receiver */}
        <button
          onClick={addReceiver}
          className="mt-4 text-blue-600 font-medium"
        >
          + Add Receiver
        </button>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="text-red-500 font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            disabled={loading}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Invites"}
          </button>
        </div>
      </div>
    </div>
  );
}
