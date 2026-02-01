import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 hindi-text mb-6">एडमिन डैशबोर्ड</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-primary-red text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold hindi-text">कुल पोस्ट</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-green-500 text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold hindi-text">कुल यूज़र</h3>
            <p className="text-3xl font-bold">156</p>
          </div>
          <div className="bg-blue-500 text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold hindi-text">कुल कमेंट</h3>
            <p className="text-3xl font-bold">89</p>
          </div>
          <div className="bg-yellow-500 text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold hindi-text">आज के व्यूज़</h3>
            <p className="text-3xl font-bold">1.2K</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold hindi-text mb-4">हाल की पोस्ट</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white p-3 rounded-lg border">
                  <h4 className="font-semibold hindi-text">नमूना ब्लॉग पोस्ट {item}</h4>
                  <p className="text-sm text-gray-600">2 घंटे पहले</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold hindi-text mb-4">त्वरित कार्य</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-primary-red text-white p-4 rounded-lg hover:opacity-90">
                <span className="block font-semibold hindi-text">नई पोस्ट</span>
              </button>
              <button className="bg-blue-500 text-white p-4 rounded-lg hover:opacity-90">
                <span className="block font-semibold hindi-text">कैटेगरी</span>
              </button>
              <button className="bg-green-500 text-white p-4 rounded-lg hover:opacity-90">
                <span className="block font-semibold hindi-text">फीचर्ड</span>
              </button>
              <button className="bg-yellow-500 text-white p-4 rounded-lg hover:opacity-90">
                <span className="block font-semibold hindi-text">सेटिंग्स</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}