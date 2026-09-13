import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SIM_ROOT = ROOT / "assets" / "js" / "simulations"


def load_manifest():
    source = (ROOT / "assets" / "data" / "simulation-catalog.mjs").read_text(encoding="utf-8")
    match = re.search(
        r"export const SIMULATION_CATALOG = (\[.*?\]);\s*export const SIMULATION_COUNTS",
        source,
        re.DOTALL,
    )
    if not match:
        raise AssertionError("Could not parse simulation catalog")
    return json.loads(match.group(1))


class SimulationIntegrationTestCase(unittest.TestCase):
    def test_catalog_has_exact_inventory_and_states(self):
        entries = load_manifest()
        ready = [entry for entry in entries if entry["status"] == "ready"]
        planned = [entry for entry in entries if entry["status"] == "planned"]

        self.assertEqual(len(entries), 308)
        self.assertEqual(len(ready), 308)
        self.assertEqual(len(planned), 0)
        self.assertEqual(len({(entry["libraryId"], entry["sourcePath"]) for entry in entries}), 308)
        self.assertEqual({entry["libraryId"] for entry in entries}, {"ibm-ai-engineering"})
        self.assertEqual(
            {entry["courseId"] for entry in ready},
            {entry["courseId"] for entry in entries},
        )

    def test_every_ready_mapping_resolves_to_a_spec_and_engine(self):
        entries = load_manifest()
        loader_source = (SIM_ROOT / "engine-loaders.js").read_text(encoding="utf-8")
        loaders = dict(re.findall(
            r'\["([^"]+)", \(\) => import\("\.\/engines\/([^"]+)"\)\]',
            loader_source,
        ))

        self.assertEqual(len(loaders), 46)
        for entry in entries:
            if entry["status"] != "ready":
                self.assertIsNone(entry["specifier"])
                continue
            with self.subTest(sourcePath=entry["sourcePath"]):
                spec_path = SIM_ROOT / entry["specifier"].removeprefix("./")
                self.assertTrue(spec_path.is_file())
                self.assertIn(entry["engine"], loaders)
                self.assertTrue((SIM_ROOT / "engines" / loaders[entry["engine"]]).is_file())

                spec_source = spec_path.read_text(encoding="utf-8")
                if entry["engine"] == "DedicatedLessonLab":
                    self.assertEqual(entry["specifier"], "./lessons/dedicated-course-spec.js")
                    self.assertIn("createDedicatedCourseSpec", spec_source)
                    self.assertIn("FAMILY_TO_MODE", spec_source)
                    blueprint_source = (SIM_ROOT / "lessons" / "dedicated-course-blueprints.js").read_text(encoding="utf-8")
                    self.assertIn(entry["sourcePath"], blueprint_source)
                else:
                    for key in ("id", "courseId", "moduleId", "sourcePath", "sourceFormat", "engine"):
                        self.assertIn(f'{key}: {json.dumps(entry[key])}', spec_source)

    def test_host_uses_lazy_runtime_and_shared_firebase_completion(self):
        app = (ROOT / "assets" / "js" / "course-library" / "app.js").read_text(encoding="utf-8")
        integration = (SIM_ROOT / "integration.js").read_text(encoding="utf-8")
        html = (ROOT / "course-library.html").read_text(encoding="utf-8")

        self.assertIn('import("../simulations/integration.js")', app)
        self.assertNotIn('from "../simulations/integration.js"', app)
        self.assertIn("setFilesComplete([file], checked)", app)
        self.assertIn('id="simulation-dialog"', html)
        self.assertIn('data-simulation-reset', html)
        self.assertIn('data-simulation-complete', html)
        self.assertNotIn("localStorage", integration)
        self.assertNotIn('"/source/', integration)

    def test_simulation_css_is_scoped_to_host_panel(self):
        css = (ROOT / "assets" / "css" / "simulations.css").read_text(encoding="utf-8")
        self.assertIn(".simulation-panel svg", css)
        self.assertIn(".simulation-panel .lab-container", css)
        self.assertNotRegex(css, re.compile(r"(?m)^:root\s*\{"))
        self.assertNotRegex(css, re.compile(r"(?m)^body\s*\{"))


if __name__ == "__main__":
    unittest.main()
