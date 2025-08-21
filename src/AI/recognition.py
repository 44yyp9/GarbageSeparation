from ultralytics import YOLO

if __name__ == '__main__':
    # Load a model
    model = YOLO('3garbage_best.pt')

    # Predict the model
    model.predict('data/pet+kan.jpg', save=True, conf=0.5)
