import styles from '../styles/components/Profile.module.css';

export function Profile() {
    return (
        <div className={styles.profileContainer}>
            <img src="https://media-exp1.licdn.com/dms/image/C4E03AQFNOc4BRE7r7Q/profile-displayphoto-shrink_800_800/0/1600084186743?e=1619654400&v=beta&t=y5wz-6YUlS58lQKwpQrJ3fk-O68R72noX9bxeDs5TCU" alt="Danilo Domingues"/>
            <div>
                <strong>Danilo Domingues</strong>
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level 1
                </p>
            </div>
        </div>
    );
}