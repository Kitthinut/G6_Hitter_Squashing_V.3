class Tutorial {
    constructor() {
      this.tutorialShown = localStorage.getItem('tutorialShown') || false;
      this.steps = [
        "📌 วิธีใช้งาน:\n- คลิกบนแผนที่เพื่อเลือกเป้าหมายที่ต้องการ\n- กดปุ่มโซนเพื่อให้ระบบคำนวณมุมที่เหมาะสม\n- ไปที่หน้า 'ตั้งค่า' เพื่อเลือกแผนที่และปรับค่าทางฟิสิกส์",
        "🎯 การเลือกแผนที่:\n- กดปุ่มแผนที่ในหน้าตั้งค่าเพื่อเลือกสนาม\n- เมื่อเลือกแล้ว, แผนที่จะถูกแสดงใน preview ด้านข้าง"
      ];
    }
  
    showTutorial() {
      if (!this.tutorialShown) {
        let tutorialMessage = this.steps.join("\n\n");
        alert(tutorialMessage);
        localStorage.setItem('tutorialShown', 'true');
      }
    }
  }
  
  const tutorial = new Tutorial();
  
  window.addEventListener('DOMContentLoaded', () => {
    tutorial.showTutorial();
  });
  