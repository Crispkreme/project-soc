import React, { lazy, Suspense } from 'react';

const Tabs = lazy(() => import("@/Components/Links/Tabs"));
const UserDetail = lazy(() => import("@/Components/Cards/UserDetail"));
const PatientLayout = lazy(() => import("@/Layouts/PatientLayout"));

const Bhw = ({ totalBhw, totalPatient, totalPractitioner, practitioners, bhws }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatientLayout>
        <Tabs tabTitles={[`Patient ${totalPatient}`, `Practitioner ${totalPractitioner}`, `Bhw ${totalBhw}`]}>
          <div>
            <h2>First Tab Panel</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas dolores voluptate temporibus.</p>
          </div>
          <div>
            <h2>List of Practitioner</h2>
            {practitioners.length > 0 ? (
              <div style={styles.cardContainer}>
                {practitioners.map((practitioner) => (
                  <UserDetail
                    key={practitioner.id}
                    userDetail={{
                      role: practitioner.role,
                      profile: practitioner.profile || "https://cdn-icons-png.freepik.com/512/700/700674.png",
                      firstname: practitioner.firstname,
                      middlename: practitioner.middlename,
                      lastname: practitioner.lastname,
                      address: practitioner.address || "No Address Provided",
                    }}
                  />
                ))}
              </div>
            ) : (
              <div>No Available Practitioner</div>
            )}
          </div>
          <div>
            <h2>List of Barangay Health Worker</h2>
            {bhws.length > 0 ? (
              <div style={styles.cardContainer}>
                {bhws.map((bhw) => (
                  <UserDetail
                    key={bhw.id}
                    userDetail={{
                      role: bhw.role,
                      profile: bhw.profile || "https://cdn-icons-png.freepik.com/512/700/700674.png",
                      firstname: bhw.firstname,
                      middlename: bhw.middlename,
                      lastname: bhw.lastname,
                      address: bhw.address || "No Address Provided",
                    }}
                  />
                ))}
              </div>
            ) : (
              <div>No Available Bhw</div>
            )}
          </div>
        </Tabs>
      </PatientLayout>
    </Suspense>
  );
};

const styles = {
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    padding: '16px',
  },
};

export default Bhw;
