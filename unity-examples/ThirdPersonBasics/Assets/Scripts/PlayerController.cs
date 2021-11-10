using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerController : MonoBehaviour
{
    private CharacterController controller;
    private Transform cameraTransform;
    [SerializeField] private float speed = 6f;
    [SerializeField] private float rotationSpeed = 5f;
    private PlayerInput input;
    private Vector3 direction;
    private InputAction move;
    
    void Start()
    {
        controller = GetComponent<CharacterController>();
        input = GetComponent<PlayerInput>();
        move = input.actions["Move"];
        cameraTransform = Camera.main.transform;

    }

    // Update is called once per frame
    void Update()
    {
        Vector2 wasd = move.ReadValue<Vector2>();
        direction = new Vector3(wasd.x, 0f, wasd.y).normalized;
        
        direction = direction.x * cameraTransform.right.normalized
        + direction.z * cameraTransform.forward.normalized;
        direction.y = 0f;

        Quaternion targetRotation = Quaternion.Euler(0, cameraTransform.eulerAngles.y, 0);
        transform.rotation = Quaternion.Lerp(transform.rotation,
            targetRotation, rotationSpeed); 
        
        controller.Move(direction * speed * Time.deltaTime);
    }
}
