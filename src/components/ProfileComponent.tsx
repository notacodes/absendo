import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  birthday: string;
  first_name_trainer: string;
  last_name_trainer: string;
  class: string;
}

function ProfileComponent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    birthday: "",
    class: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          setUserData(data);
          setFormState({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            birthday: data.birthday || "",
            class: data.class || "",
          });
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    }
    fetchUserData();
  }, [user]);

  function getUserShortName() {
    if (!userData) return "NN";
    const first = userData.first_name?.charAt(0).toUpperCase() || "";
    const last = userData.last_name?.charAt(0).toUpperCase() || "";
    return `${first}${last}`;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: formState.first_name,
          last_name: formState.last_name,
          birthday: formState.birthday,
          class: formState.class,
        })
        .eq("id", user.id);

      if (error) throw error;
      alert("Daten erfolgreich aktualisiert.");
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      alert("Fehler beim Speichern.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center text-red-500 mt-10">
        Benutzerdaten konnten nicht geladen werden.
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <div className="avatar">
            <div className="w-24 rounded-full bg-primary text-primary-content grid place-items-center text-xl font-bold">
              <div className="flex items-center justify-center w-full h-full">
                {getUserShortName()}
              </div>
            </div>
          </div>
          <h2 className="card-title mt-4">
            {userData.first_name} {userData.last_name}
          </h2>
          <p className="text-sm text-gray-500">{userData.birthday}</p>
          <p className="text-sm text-gray-500">
            {userData.first_name_trainer} {userData.last_name_trainer}
          </p>
          <p className="text-sm text-gray-500">{userData.class}</p>
        </div>
      </div>

      {/* Editable Form */}
      <div className="lg:col-span-2 card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Profil bearbeiten</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              placeholder="Vorname"
              className="input input-bordered w-full"
              value={formState.first_name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Nachname"
              className="input input-bordered w-full"
              value={formState.last_name}
              onChange={handleChange}
            />
            <input
              type="date"
              name="birthday"
              className="input input-bordered w-full"
              value={formState.birthday}
              onChange={handleChange}
            />
            <input
              type="text"
              name="class"
              placeholder="Klasse"
              className="input input-bordered w-full"
              value={formState.class}
              onChange={handleChange}
            />
            <div className="md:col-span-2 text-right">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Speichern..." : "Speichern"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileComponent;
