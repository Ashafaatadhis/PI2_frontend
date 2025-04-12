"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clipboard,
  Smile,
} from "lucide-react";
import { api } from "@/trpc/react";
import Link from "next/link";

const ActivityPage = () => {
  const { data: status, isPending } = api.stress.checkToday.useQuery();

  const { data: history, isPending: loadingHistory } =
    api.stress.getHistory.useQuery();

  return (
    <div className="ml-8 space-y-6 p-6">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Aktivitas Harian
      </h3>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Kiri: Card Status */}
        <Card className="w-full rounded-xl p-8 shadow-xl transition-all hover:shadow-2xl">
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clipboard className="text-2xl" />
                <p className="font-semibold">Catatan Aktivitas</p>
              </div>
            </div>

            {isPending ? (
              <div className="animate-pulse space-y-4">
                <div className="h-5 w-1/3 rounded bg-gray-300 dark:bg-gray-700" />
                <div className="h-24 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
              </div>
            ) : status?.hasSubmitted ? (
              <div className="text-lg leading-7 font-semibold text-green-500">
                <CheckCircle className="mr-2 inline text-3xl" />✅ Aktivitas
                sudah dicatat hari ini!
              </div>
            ) : (
              <div>
                <p className="mb-4 text-lg leading-7 font-semibold">
                  Klik tombol di bawah ini untuk mencatat aktivitas harian Anda:
                </p>
                <Link href={"/dashboard/stress-prediction"}>
                  <Button className="rounded-md bg-blue-500 p-4 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-600">
                    Kirim Aktivitas Hari Ini
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Kanan: Tips */}
        <Card className="w-full rounded-xl bg-gray-800 p-6 text-white shadow-md">
          <CardContent>
            <p className="text-lg font-semibold">Tips Hari Ini:</p>
            <ul className="my-6 ml-6 list-disc space-y-2">
              {status?.level?.prediksi === "Rendah" && (
                <>
                  <li>
                    Luangkan waktu untuk bersantai dan menikmati aktivitas
                    ringan.
                  </li>
                  <li>
                    Ingat untuk menjaga keseimbangan antara pekerjaan dan
                    istirahat.
                  </li>
                </>
              )}
              {status?.level?.prediksi === "Sedang" && (
                <>
                  <li>
                    Ingat untuk tetap melakukan aktivitas yang menyenangkan!
                  </li>
                  <li>Jaga waktu tidur Anda agar tetap optimal.</li>
                  <li>Rencanakan waktu untuk berolahraga agar lebih bugar.</li>
                </>
              )}
              {status?.level?.prediksi === "Tinggi" && (
                <>
                  <li>
                    Cobalah untuk mengambil napas dalam-dalam atau melakukan
                    meditasi.
                  </li>
                  <li>
                    Jika Anda merasa stres berlebihan, coba cari dukungan dari
                    teman atau profesional.
                  </li>
                  <li>
                    Cobalah beristirahat sejenak dan lakukan aktivitas yang
                    dapat menenangkan pikiran Anda.
                  </li>
                </>
              )}

              {/* Pesan jika belum ada aktivitas */}
              {!status?.level?.prediksi && (
                <li>
                  Belum ada data aktivitas hari ini. Pastikan untuk mengisi
                  aktivitas Anda agar bisa mendapatkan tips yang lebih personal!
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Riwayat Prediksi - full width */}
      <Card className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
        <CardContent className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
            Riwayat Prediksi
          </h4>

          {loadingHistory ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          ) : history && history.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-md border border-gray-200 p-4 text-sm shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-600 dark:text-gray-300">
                      {new Date(item.dailyActivity.tanggal).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>

                    <span className="text-xs text-gray-400">
                      Confidence:{" "}
                      {item.prediksi === "Tinggi"
                        ? `${(item.probTinggi * 100).toFixed(1)}%`
                        : item.prediksi === "Sedang"
                          ? `${(item.probSedang * 100).toFixed(1)}%`
                          : `${(item.probRendah * 100).toFixed(1)}%`}
                    </span>

                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        🛌 Tidur: {item.dailyActivity.jamTidur} jam
                      </span>
                      <span className="flex items-center gap-1">
                        📱 Screen Time: {item.dailyActivity.screenTime} jam
                      </span>
                      <span className="flex items-center gap-1">
                        🏃‍♂️ Olahraga: {item.dailyActivity.waktuOlahraga} jam
                      </span>
                      <span className="flex items-center gap-1">
                        📖 Belajar: {item.dailyActivity.waktuBelajar} jam
                      </span>
                      <span className="col-span-2 flex items-center gap-1">
                        📚 Tugas: {item.dailyActivity.jumlahTugas} tugas
                      </span>
                    </div>
                  </div>

                  <span
                    className={`mt-4 flex items-center gap-1 self-start rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.prediksi === "Tinggi"
                        ? "bg-red-100 text-red-600"
                        : item.prediksi === "Sedang"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                    }`}
                  >
                    {item.prediksi === "Tinggi"
                      ? "🚨"
                      : item.prediksi === "Sedang"
                        ? "⚠️"
                        : "✅"}{" "}
                    {item.prediksi}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Belum ada riwayat aktivitas.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityPage;
