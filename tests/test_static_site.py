import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "index.html": "assets/js/roadmap/app.js",
    "courses.html": "assets/js/course-catalog/app.js",
    "course-library.html": "assets/js/course-library/app.js",
}


class StaticSiteTestCase(unittest.TestCase):
    def test_pages_load_module_apps_and_auth_controls(self):
        for filename, script in PAGES.items():
            with self.subTest(filename=filename):
                html = (ROOT / filename).read_text(encoding="utf-8")
                self.assertIn(f'<script type="module" src="{script}"></script>', html)
                self.assertEqual(html.count('id="auth-button"'), 1)
                self.assertEqual(html.count('id="progress-status"'), 1)

    def test_firebase_configuration_targets_expected_project(self):
        config = (ROOT / "assets/js/firebase-config.js").read_text(encoding="utf-8")
        self.assertIn('projectId: "ai-engineering-guide"', config)
        self.assertIn('authDomain: "ai-engineering-guide.firebaseapp.com"', config)
        self.assertNotRegex(config, re.compile(r"private[_ -]?key", re.IGNORECASE))

    def test_progress_store_uses_auth_and_firestore(self):
        source = (ROOT / "assets/js/progress-store.js").read_text(encoding="utf-8")
        self.assertIn("firebase-auth.js", source)
        self.assertIn("firebase-firestore.js", source)
        self.assertIn("signInWithPopup", source)
        self.assertIn("serverTimestamp", source)
        self.assertNotIn("/api/progress", source)

    def test_all_page_apps_import_shared_progress_store(self):
        for script in PAGES.values():
            with self.subTest(script=script):
                source = (ROOT / script).read_text(encoding="utf-8")
                self.assertTrue(source.startswith('import { ProgressStore, setupAuthControls }'))


if __name__ == "__main__":
    unittest.main()
